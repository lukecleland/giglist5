"use client";

import { useEffect, useState } from "react";
import { Holding } from "../gigtools/components/Holding";
import { Submissions } from "../gigtools/components/Submissions";
import { v4 as uuidv4 } from "uuid";
import { set } from "zod";
import { Chip } from "@heroui/react";

type UserDetails = {
  name: string;
  email: string;
  isLoggedIn: boolean;
};

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    isLoggedIn: false,
  });

  useEffect(() => {
    if (!userDetails.isLoggedIn) {
      setIsLoggedIn(false);

      const existing = localStorage.getItem("giglistAnonymousUser");
      if (existing) {
        setUserId(`anonymousUser:${existing}`);
      } else {
        const id = uuidv4();
        localStorage.setItem("giglistAnonymousUser", id);
        setUserId(`anonymousUser:${id}`);
      }
    } else {
      setUserId(userDetails.name);
    }
  }, []);

  return (
    <>
      <h4>Submit</h4>

      <div className="flex gap-2">
        <Chip color="danger">
          {isLoggedIn ? "Logged In User" : "User Not Logged In"}
        </Chip>
        <Chip color="primary">{userId}</Chip>
      </div>

      <Holding
        label="Submitted Gigs (Pending Approval)"
        scraper="submissions"
        showHidden={false}
        submittedBy={userId || "Unknown"}
      />
      <Submissions submittedBy={`${userId}`} />
    </>
  );
}
