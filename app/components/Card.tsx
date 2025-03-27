"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

interface CardProps {
  title?: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  children?: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt = 'Card image',
  children,
  className = ''
}) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

 // Check if there's content apart from the image
 const hasContent = title || description || children

  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image()
      img.src = imageUrl
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      }
    }
  }, [imageUrl])

  return (
    <div
      className={`
        bg-gray-200 
        rounded-2xl 
        shadow-xl 
        overflow-hidden 
        transition-all 
        duration-300 
        hover:shadow-xl 
        ${className}
      `}
    >
      {/* Image Header */}
      {imageUrl && dimensions && (
        <div className="w-full">
          <Image
            src={imageUrl}
            alt={imageAlt}
            className="object-contain w-full h-auto"
            layout="responsive"
            width={dimensions.width}
            height={dimensions.height}
            priority
          />
        </div>
      )}
      {imageUrl && !dimensions && (
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-white">
          Loading image...
        </div>
      )}
      
      {/* Card Body: Render only if there's content */}
      {hasContent && (
        <div className="p-6 bg-gray-200">
          {title && (
            <h2 className="text-2xl font-bold text-gray-800 mb-3 transition-colors duration-300 group-hover:text-blue-600">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 mb-4 text-base leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="text-gray-700 space-y-3">{children}</div>}
        </div>
      )}
    </div>
  )
}

export default Card
