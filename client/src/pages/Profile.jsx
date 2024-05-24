import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOut,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

function Profile() {
  const BASE_URL =
    import.meta.env.VITE_NODE_ENV === "development"
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_PROD_URL;

  const [formData, setFormData] = React.useState({});
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const fileRef = React.useRef(null);
  const [image, setImage] = React.useState(null);
  const [imageUploadProgress, setImageUploadProgress] = React.useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imageError, setImageError] = React.useState(false);

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/signout`, {
        method: "GET",
        credentials: "include",
      });
      dispatch(signOut());
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      return; //or set a state
    }
    try {
      dispatch(updateUserStart());
      const response = await fetch(
        `${BASE_URL}/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          credentials: "include", // includes the token in the header
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (!data.email) {
        dispatch(updateUserFailure(data));
        return;
      }
      setUpdateSuccess(true);
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(data.mesage));
    }
  };

  React.useEffect(() => {
    if (image) handleImageUpload();
  }, [image]);

  const handleImageUpload = async () => {
    setImageError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(Math.round(progress));
      },
      (error) => {
        if (error) setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profileImage: downloadURL })
        );
      }
    );
  };

  const handleDelete = async () => {
    dispatch(deleteUserStart());
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log(data);
      navigate("/");
      if (!data.success) {
        dispatch(deleteUserFailure(data));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (e) {
      dispatch(deleteUserFailure(e));
    }
  };

  return (
    <div className="mx-auto p-3 mt-10">
      <h1 className="text-center font-semibold text-3xl py-3"> Profile</h1>
      <form
        className="flex justify-center items-center flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />

        <img
          src={formData.profileImage || currentUser.profileImage}
          alt="profile image"
          className="h-24 w-24 rounded-full self-center cursor-pointer object-cover mb-3"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imageUploadProgress > 0 && imageUploadProgress < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imageUploadProgress} %`}</span>
          ) : imageUploadProgress === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="username"
          id="username"
          placeholder={currentUser.username}
          className="bg-slate-50 rounded-lg py-2 px-2 outline-none w-full sm:w-[75%] lg:w-[35%]"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder={currentUser.email}
          className="bg-slate-50 rounded-lg py-2 px-2 outline-none w-full sm:w-[75%] lg:w-[35%]"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-50 rounded-lg py-2 px-2 outline-none w-full sm:w-[75%] lg:w-[35%]"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 rounded-lg p-3 w-full sm:w-[75%] lg:w-[35%] disabled:opacity-70 hover:opacity-95 uppercase text-white"
          disabled={currentUser.loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <div className="flex justify-between w-full sm:w-[75%] lg:w-[35%]">
          <p>
            <Link
              className="underline cursor-pointer text-red-500 hover:opacity-85"
              onClick={handleDelete}
            >
              Delete Account
            </Link>
          </p>
          <p>
            <Link
              onClick={handleSignOut}
              className="underline hover:opacity-85 cursor-pointer text-red-500"
            >
              Sign Out
            </Link>
          </p>
        </div>
        {error && (
          <p className="text-red-500">
            Something went wrong. Please try again.
          </p>
        )}
        {updateSuccess && (
          <p className="text-green-500">Profile Updated Successfully.</p>
        )}
      </form>
    </div>
  );
}

export default Profile;
