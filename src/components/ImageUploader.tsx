
import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImageUploaderProps {
  existingImageUrl: string | null
  onImageUploaded: (imageUrl: string) => void
  onImageRemoved: () => void
}

const ImageUploader = ({
  existingImageUrl,
  onImageUploaded,
  onImageRemoved,
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    existingImageUrl,
  )
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return false
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return false
    }

    return true
  }

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return

    setIsUploading(true)

    try {
      // Convert to base64 for mock implementation
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        
        // Update preview and notify parent
        setImagePreview(imageUrl)
        onImageUploaded(imageUrl)
        toast.success('Image uploaded successfully')
        setIsUploading(false)
      }
      reader.onerror = () => {
        toast.error('Failed to upload image. Please try again.')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image. Please try again.')
      setIsUploading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    uploadFile(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    onImageRemoved()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      uploadFile(file)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Product preview"
            className="h-40 w-full object-cover rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50'} rounded-md p-6 flex flex-col items-center justify-center transition-colors`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mb-3">
            <Upload
              className={`h-10 w-10 ${isDragging ? 'text-primary' : 'text-gray-400'}`}
            />
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Drag and drop an image or click to browse
          </p>
          <p className="text-xs text-gray-400 mb-4">PNG, JPG, GIF up to 5MB</p>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={handleBrowseClick}
          >
            {isUploading ? 'Uploading...' : 'Choose File'}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
