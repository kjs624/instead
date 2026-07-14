'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

interface Props {
  userId: string
  onSuccess: () => void
  onClose: () => void
}

export default function CreateRecord({ userId, onSuccess, onClose }: Props) {
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!content.trim()) return
    setSubmitting(true)

    const supabase = createClient()
    let image_url: string | null = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `records/${userId}/${Date.now()}.${ext}`
      const { data: upload, error: uploadError } = await supabase.storage
        .from('donations')
        .upload(path, imageFile, { upsert: true })

      if (!uploadError && upload) {
        const { data: { publicUrl } } = supabase.storage.from('donations').getPublicUrl(path)
        image_url = publicUrl
      }
    }

    await supabase.from('donation_records').insert({
      user_id: userId,
      content: content.trim(),
      image_url,
      likes_count: 0,
    })

    setDone(true)
    setSubmitting(false)
    setTimeout(() => {
      onSuccess()
      onClose()
    }, 1500)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="text-5xl">🌸</div>
        <p className="text-text-main font-medium text-center">따뜻한 기록이 남겨졌어요</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text-main">나눔 기록 남기기</h2>
        <button onClick={onClose} className="text-text-muted text-xl">✕</button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-text-sub mb-1.5">오늘의 나눔을 기록해주세요</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="오늘 어떤 따뜻한 일을 하셨나요? 함께 나눠요 🌱"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-sub mb-1.5">사진 첨부 (선택)</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image src={preview} alt="미리보기" fill className="object-cover" />
              <button
                onClick={() => { setImageFile(null); setPreview(null) }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted hover:border-primary/50 hover:text-primary transition-all"
            >
              <span className="text-2xl mb-1">📷</span>
              <span className="text-sm">사진을 선택해주세요</span>
            </button>
          )}
        </div>

        <Button
          size="lg"
          className="w-full"
          loading={submitting}
          disabled={!content.trim()}
          onClick={handleSubmit}
        >
          나눔 기록 남기기 🌸
        </Button>
      </div>
    </div>
  )
}
