'use client'

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react'

export interface AudioManagerProps {
  bgmUrl?: string
  voiceUrl?: string
  playVoice?: boolean
  onError?: (error: Error) => void
  onVoiceEnded?: () => void
}

export interface AudioManagerRef {
  play: () => void
  pause: () => void
  isPlaying: () => boolean
}

const AudioManager = forwardRef<AudioManagerRef, AudioManagerProps>(
  ({ bgmUrl, voiceUrl, playVoice = false, onError, onVoiceEnded }, ref) => {
    const bgmAudioRef = useRef<HTMLAudioElement | null>(null)
    const voiceAudioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    // BGM Audio 초기화
    useEffect(() => {
      if (!bgmUrl) return

      const bgmAudio = new Audio(bgmUrl)
      bgmAudio.loop = true
      bgmAudio.volume = 0.7 // BGM 볼륨 조절 (선택사항)

      bgmAudio.addEventListener('error', (e) => {
        const error = new Error(`BGM 재생 실패: ${bgmUrl}`)
        onError?.(error)
        console.error('BGM 재생 오류:', error)
      })

      bgmAudio.addEventListener('play', () => {
        setIsPlaying(true)
      })

      bgmAudio.addEventListener('pause', () => {
        setIsPlaying(false)
      })

      bgmAudioRef.current = bgmAudio

      return () => {
        bgmAudio.pause()
        bgmAudio.removeEventListener('error', () => {})
        bgmAudio.removeEventListener('play', () => {})
        bgmAudio.removeEventListener('pause', () => {})
        bgmAudioRef.current = null
      }
    }, [bgmUrl, onError])

    // 음성 가이드 Audio 초기화
    useEffect(() => {
      if (!voiceUrl) return

      const voiceAudio = new Audio(voiceUrl)
      voiceAudio.volume = 1.0 // 음성 가이드는 전체 볼륨

      voiceAudio.addEventListener('error', (e) => {
        const error = new Error(`음성 가이드 재생 실패: ${voiceUrl}`)
        onError?.(error)
        console.error('음성 가이드 재생 오류:', error)
      })

      voiceAudio.addEventListener('ended', () => {
        // 음성 가이드 재생 완료 시 콜백 호출
        onVoiceEnded?.()
      })

      voiceAudioRef.current = voiceAudio

      return () => {
        voiceAudio.pause()
        voiceAudio.removeEventListener('error', () => {})
        voiceAudio.removeEventListener('ended', () => {})
        voiceAudioRef.current = null
      }
    }, [voiceUrl, onError, onVoiceEnded])

    // 외부에서 호출할 수 있는 메서드 노출
    useImperativeHandle(ref, () => ({
      play: async () => {
        try {
          // BGM 재생
          if (bgmAudioRef.current) {
            await bgmAudioRef.current.play().catch((error) => {
              const err = new Error(`BGM 재생 실패: ${error.message}`)
              onError?.(err)
              console.error('BGM play() 오류:', error)
            })
          }

          // 음성 가이드 재생 (playVoice가 true일 때만)
          if (playVoice && voiceAudioRef.current) {
            // 음성 가이드는 처음부터 재생 (이전 재생이 끝났다면 처음부터)
            voiceAudioRef.current.currentTime = 0
            await voiceAudioRef.current.play().catch((error) => {
              const err = new Error(`음성 가이드 재생 실패: ${error.message}`)
              onError?.(err)
              console.error('음성 가이드 play() 오류:', error)
            })
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('알 수 없는 재생 오류')
          onError?.(err)
          console.error('AudioManager play() 오류:', error)
        }
      },
      pause: () => {
        try {
          if (bgmAudioRef.current) {
            bgmAudioRef.current.pause()
          }
          if (voiceAudioRef.current) {
            voiceAudioRef.current.pause()
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('알 수 없는 일시정지 오류')
          onError?.(err)
          console.error('AudioManager pause() 오류:', error)
        }
      },
      isPlaying: () => {
        return isPlaying
      },
    }))

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
      return () => {
        if (bgmAudioRef.current) {
          bgmAudioRef.current.pause()
          bgmAudioRef.current = null
        }
        if (voiceAudioRef.current) {
          voiceAudioRef.current.pause()
          voiceAudioRef.current = null
        }
      }
    }, [])

    // 이 컴포넌트는 UI를 렌더링하지 않음
    return null
  }
)

AudioManager.displayName = 'AudioManager'

export default AudioManager

