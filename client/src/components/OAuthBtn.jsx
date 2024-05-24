import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuthBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const response = await fetch("http://localhost:3000/api/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await response.json();
      if (data.email) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="uppercase bg-red-500 w-full sm:w-[75%] lg:w-[35%] text-white hover:opacity-95 p-3 rounded-lg"
    >
      Continue With google
    </button>
  );
}

export default OAuthBtn;
