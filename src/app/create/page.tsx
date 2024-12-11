"use client";

import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [formData, setFormData] = useState({
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { description, startDate, endDate } = formData;

    const startTimestamp = new Date(startDate).getTime() / 1000;
    const endTimestamp = new Date(endDate).getTime() / 1000;

    console.log("Poll Details:", {
      description,
      startTimestamp,
      endTimestamp,
    });

    setFormData({
      description: "",
      startDate: "",
      endDate: "",
    });

    alert("Poll created successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-16"></div>
      <div className="flex w-full flex-col items-center justify-center space-y-6">
        <h2 className="rounded-full bg-gray-800 px-6 py-2 text-lg font-bold text-white">
          Create a Poll
        </h2>

        <form
          className="w-4/5 space-y-6 rounded-2xl border border-gray-300 bg-white p-6 shadow-lg md:w-2/5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Poll Description
            </label>
            <input
              type="text"
              id="description"
              placeholder="Briefly describe the purpose of this poll..."
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-semibold text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>

          <div className="flex w-full justify-center">
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-6 py-3 font-bold text-white transition duration-200 hover:bg-gray-900"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
