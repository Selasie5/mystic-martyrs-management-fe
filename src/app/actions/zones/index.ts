"use server";
import { getCookie } from "@/lib/get-cookie"; // Import getCookie utility
import { actionClient } from "@/lib/safe-action";
import { CreateZone, UpdateZone, ZoneByID } from "@/schemas/zones";
import { flattenValidationErrors } from "next-safe-action";

// Helper function to get the Authorization header
const getAuthHeader = () => {
  const token = getCookie("access_token"); // Assuming 'access_token' is the cookie name
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token}`;
};

// Get all zones
export const getAllZones = actionClient.action(async () => {
  console.log('action triggered');
  const token = getCookie("access_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1/zones`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: getAuthHeader(), // Use dynamic token for Authorization
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Session check failed");
  }

  return await response.json();
});

// Get Zone by ID
export const getZoneByID = actionClient
  .schema(ZoneByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const response = await fetch(`https://mystic-be.vercel.app/api/v1/zones/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: getAuthHeader(), // Use dynamic token for Authorization
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  });

// Update Zone
export const updateZone = actionClient
  .schema(UpdateZone, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id, zone_name, zone_location, zone_leader_id } }) => {
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/zones/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: getAuthHeader(), // Use dynamic token for Authorization
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone_name: zone_name,
          zone_location: zone_location,
          zone_leader_id: zone_leader_id,
        }),
      }
    );
    return response.json();
  });

// Delete Zone
export const deleteZone = actionClient
  .schema(ZoneByID, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/zones/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: getAuthHeader(), // Use dynamic token for Authorization
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  });

// Create Zone
export const addZone = actionClient
  .schema(CreateZone, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { zone_leader_id, zone_location, zone_name } }) => {
    const response = await fetch(
      `https://mystic-be.vercel.app/api/v1/zones`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: getAuthHeader(), // Use dynamic token for Authorization
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone_name: zone_name,
          zone_location: zone_location,
          zone_leader_id: zone_leader_id,
        }),
      }
    );
    return response.json();
  });

// Get Zone Leaders
export const getZoneLeaders = actionClient.action(async () => {
  const response = await fetch(
    `https://mystic-be.vercel.app/api/v1/users`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: getAuthHeader(), // Use dynamic token for Authorization
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  console.log(data, 'the data that came out');

  const zoneLeaders = data?.data?.filter((item: { role: string }) => item.role === "ZONE_LEADER");

  console.log(zoneLeaders, 'zone leaders');

  return zoneLeaders;
});
