"use client"

import { useState, useRef } from "react"
import { User } from "lucide-react"

interface ProfileAvatarProps {
  name: string
  imageUrl?: string
  onImageChange?: (url: string) => void
  size?: "sm" | "md" | "lg"
  editable?: boolean
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

const sizeMap = {
  sm: "w-10 h-10 text-sm",
  md: "w-16 h-16 text-lg",
  lg: "w-24 h-24 text-2xl",
}

export function ProfileAvatar({
  name,
  imageUrl,
  onImageChange,
  size = "md",
  editable = false,
}: ProfileAvatarProps) {
  const [imgSrc, setImgSrc] = useState(imageUrl || "")
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImgSrc(url)
    onImageChange?.(url)
  }

  const initials = getInitials(name)

  return (
    <button
      type="button"
      onClick={() => editable && fileRef.current?.click()}
      className={`relative rounded-full border-2 border-primary flex items-center justify-center overflow-hidden bg-card shrink-0 ${sizeMap[size]} ${
        editable ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"
      }`}
      aria-label={editable ? "Upload profile photo" : "Profile photo"}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span className="font-bold text-primary select-none">{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-primary" />
      )}

      {editable && (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      )}
    </button>
  )
}
