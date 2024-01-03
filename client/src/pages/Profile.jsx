import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [FileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const dispatch = useDispatch();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform any additional form submission logic here
    if ((password === "" && confirmPassword === "") || passwordMatch) {
      //passwords match or not changed
      try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      } catch (error) {
        dispatch(updateUserFailure(error.message));

        console.log("Form submitted successfully");
      }
    } else {
      // Passwords do not match, show an error or take appropriate action
      console.error("Passwords do not match");
    }
  };

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    if (e.target.id === "password") {
      handlePasswordChange(e);
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListing = async (e) => {
    try {
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      })
      const data =await res.json();
      if (data.success === false) {
        console.log(data.message);
        return
      }
      setUserListing((prev) => prev.filter ((listing) => listing._id !== listingId))
    } catch (error) {
     console.log(error.message) 
    }
  }

  const handleListingEdit = async (listingId) => {
    try {
      
    } catch (error) {
     console.log(error.message) 
    }
  }
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-32 w-32 object-cover
          cursor-pointer self-center mt-2  mb-6"
        />
        <p className="text-sm self-center">
          {FileUploadError ? (
            <span className="text-red-700">
              {" "}
              Error Image upload (Image must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-800"> {`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">
              {" "}
              Image Successfully uploaded!{" "}
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg "
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="fullname"
          defaultValue={currentUser.fullname}
          id="fullname"
          className="border p-3 rounded-lg "
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="votre numero"
          defaultValue={currentUser.num}
          id="num"
          className="border p-3 rounded-lg "
          onChange={handleChange}
        />
        <input
          type="date"
          id="dateNaissance"
          className="border p-3 rounded-lg "
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg "
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="mot de passe"
          id="password"
          className="border p-3 rounded-lg "
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="confirmer votre mot de passe"
          id="confirmPassword"
          className="border p-3 rounded-lg "
          onChange={handleConfirmPasswordChange}
        />
        {!passwordMatch && (
          <p className="text-red-600 mt-5">Passwords do not match</p>
        )}
        <button
          disabled={loading}
          type="submit"
          className="
          bg-slate-700 
          text-white rounded-lg
          p-3
          uppercase hover:opacity-95
          disabled:opacity-80
        "
        >
          {loading ? "Loading ..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          {" "}
          create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-800 cursor-pointer"
        >
          delete account
        </span>
        <span onClick={handleSignOut} className="text-red-800 cursor-pointer">
          deconnexion
        </span>
      </div>

      <p className="text-red-700"> {error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      <button onClick={handleShowListing} className="text-green-500 w-full">
        {" "}
        Show listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}{" "}
      </p>

      {userListing &&
        userListing.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-3xl font-semibold"> Your listings</h1>
          {userListing.map((listing) => (
          <div
            key={listing._id}
            className="border gap-4 rounded-lg pl-3 pt-1 pr-4 pb-1 flex justify-between items-center"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-20 w-20 object-contain rounded-lg"
              />
            </Link>
            <Link
              className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col item-center">
              <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">
               delete
              </button>
              <button onClick={()=>handleListingEdit(listing._id)} className="text-green-700 uppercase">
                edit
              </button>
            </div>
          </div>
        ))}
        </div>
        }
    </div>
  );
}
