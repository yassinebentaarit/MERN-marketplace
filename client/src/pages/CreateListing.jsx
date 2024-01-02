import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto ">
      <p className="text-4xl font-semibold text-center my-7">
        Create a Listing
      </p>
      <form className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <div className="">
            <label className="rounded-xl mr-10">name: </label>
            <input
              type="text"
              placeholder="name"
              className="border p-3 rounded-lg gap-4"
              id="name"
              maxLength="64"
              min="4"
              required
            />
          </div>
          <div className="">
            <label className="rounded-xl mr-2 ">description:</label>
            <textarea
              type="text"
              placeholder="description"
              className="border p-3 rounded-lg  gap-4 align-middle"
              id="description"
              required
            />
          </div>
          <div className="">
            <label className="rounded-xl mr-6">address: </label>
            <input
              type="text"
              placeholder="address"
              className="border p-3 rounded-lg "
              id="address"
              required
            />
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5"></input>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5"></input>
              <span>rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"></input>
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="fourniched" className="w-5"></input>
              <span>Fourniched</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"></input>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="9"
                required
              />
              <p>bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="1"
                max="9999999"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                min="1"
                max="9999999"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              the first image will be the cover
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              className="
            p-3 
            text-green-700 
            border 
            border-green-700 rounded 
            uppercase
            hover:shadow-lg 
            hover:bg-green-50
            disabled-80
            "
            >
              Upload
            </button>
          </div>
          <button
            className="
            p-3
            mt-10
            bg-slate-700
            text-white
            rounded-lg
            uppercase
            hover:opacity-95
            disabled:opacity-80 
        "
          >
            Create listing
          </button>
        </div>
      </form>
    </main>
  );
}
