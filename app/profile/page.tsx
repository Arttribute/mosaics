"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SquareArrowOutUpRight, LoaderCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AppBar from "@/components/layout/AppBar";

export default function ProfilePage() {
  const [userName, setUsername] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      setUsername(user.ens_username || user.eth_address);
      setUserPicture(user.profilePicture || "/fallback-avatar.png");
    }
  }, []);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLoadingImage(true);
    if (event.target.files) {
      const data = new FormData();
      data.append("file", event.target.files[0]);
      data.append("upload_preset", "studio-upload");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/arttribute/upload",
        data
      );
      setUserPicture(res.data.secure_url);
      setLoadingImage(false);
    }
  }

  async function saveDetails() {
    setLoading(true);
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      const updatedUser = {
        ...user,
        profilePicture: userPicture,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLoading(false);
      router.push("/profile");
    }
  }

  return (
    <div>
      <AppBar />
      <div className="flex flex-col items-center justify-center w-full mt-20">
        <div className="text-xl font-semibold mt-2 mb-6">My Profile</div>
        <div className="w-full flex flex-col gap-6 mt-4 items-center">
          <div className="flex flex-col w-full gap-2 pt-4 items-center">
            <label htmlFor="user-image">
              {loadingImage ? (
                <div className="w-[200px] h-[200px] bg-gray-50 rounded-full flex flex-col items-center justify-center m-1 mt-4">
                  <LoaderCircle className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <Image
                  src={userPicture}
                  width={200}
                  height={200}
                  alt="User Avatar"
                  className="aspect-[1] rounded-full m-1 mt-4"
                />
              )}
            </label>
            <input
              id="user-image"
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div>
              <h2 className="font-bold">Change Profile Picture</h2>
            </div>

            <div className="flex flex-col items-center justify-center mt-4">
              <Input
                placeholder="User name"
                className="w-72"
                value={userName}
                readOnly
              />
              <p className="text-sm text-gray-500">ENS name is uneditable</p>
              {loading ? (
                <Button disabled className="mt-2 w-72">
                  <LoaderCircle className="animate-spin text-gray-500" />
                </Button>
              ) : (
                <Button onClick={saveDetails} className="mt-2 w-72">
                  Save details
                </Button>
              )}

              <Link href="/games">
                <Button variant="ghost" className="mt-2 w-72">
                  Play a game
                  <SquareArrowOutUpRight className="w-4 h-4 ml-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
