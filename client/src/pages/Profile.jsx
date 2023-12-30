import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [FileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any additional form submission logic here
    if (password === "" && confirmPassword === "") {
      // At least one of the passwords is empty, you can proceed with form submission
      console.log("Form submitted successfully");
    } else {
      if (passwordMatch) {
        // Passwords match, you can proceed with form submission
        console.log("Form submitted successfully");
      } else {
        // Passwords do not match, show an error or take appropriate action
        console.error("Passwords do not match");
      }
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
      'state_changed',
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
            <span className="text-red-700"> Error Image upload (Image must be less than 2mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? ( 
            <span className="text-slate-800"> {`Uploading ${filePerc}%`}</span> 
          ) : filePerc === 100 ? (
            <span className="text-green-700"> Image Successfully uploaded! </span>
          ) : ( '' )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg "
        />
        <input
          type="text"
          placeholder="fullname"
          id="fullname"
          className="border p-3 rounded-lg "
        />
        <input
          type="number"
          placeholder="votre numero"
          id="num"
          className="border p-3 rounded-lg "
        />
        <input
          type="date"
          id="dateNaissance"
          className="border p-3 rounded-lg "
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg "
        />
        <input
          type="password"
          placeholder="mot de passe"
          id="password"
          className="border p-3 rounded-lg "
        />
        <input
          type="password"
          placeholder="confirmer votre mot de passe"
          id="confirmPassword"
          className="border p-3 rounded-lg "
        />
        {!passwordMatch && (
          <p className="text-red-600 mt-5">Passwords do not match</p>
        )}
        <button
          type="submit"
          className="
          bg-slate-700 
          text-white rounded-lg
          p-3
          uppercase hover:opacity-95
          disabled:opacity-80
        "
        >
          Submit
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span span className="text-red-800 cursor-pointer">
          delete account
        </span>
        <span className="text-red-800 cursor-pointer">deconnexion</span>
      </div>
    </div>
  );
}
