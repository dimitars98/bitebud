import React from "react";
import { useParams } from "react-router-dom";

export default function Restaurant() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">Restaurant Details</h2>
      <p className="text-gray-600">
        You are viewing restaurant with ID: <strong>{id}</strong>
      </p>
      {/* TODO: Fetch restaurant info & menu based on ID */}
    </div>
  );
}
