import React from 'react';
import Image from "next/image";

const ImagePostGrid = () => {
  // Sample data - in real app, this would be passed as props
  const posts = [
    {
      id: 1,
      imageUrl: "/AlFaruqIslamicSchool.Approved.July2024.jpeg",
      text: ""
    },
    {
      id: 2,
      imageUrl: "/AlFaruq.Weekend.Quran.School.March2025",
      text: null
    },
    {
      id: 3,
      imageUrl: "/AlFaruq.ClassicalArabicProgram.jpeg",
      text: ""
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="flex flex-col rounded-lg overflow-hidden bg-white shadow-md"
          >
            <div className="h-[500px] w-full flex items-center justify-center bg-gray-50 p-4">
              <div className="relative">
                <Image
                  src={post.imageUrl}
                  alt={post.text || "Post image"}
                  className="max-h-[470px] w-auto object-contain"
                  width={600}
                  height={800}
                  priority={post.id <= 4}
                />
              </div>
            </div>
            {post.text && (
              <div className="p-4">
                <p className="text-gray-800 text-sm">{post.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePostGrid;