import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

import { useEffect, useState } from "react"
import { apiFetch, getImageUrl } from "../../services/api"

export default function ExerciseViewerModal({ open, onClose, exercise }: any) {

  const [media, setMedia] = useState<any[]>([])

  // 🔄 traer archivos del ejercicio
  const fetchMedia = async () => {
    try {
      const res = await apiFetch(`/exercise-files/${exercise.id}`)

      console.log("MEDIA:", res)

      setMedia(Array.isArray(res) ? res : [])
    } catch (error) {
      console.error(error)
      setMedia([])
    }
  }

  useEffect(() => {
    if (exercise?.id && open) {
      fetchMedia()
    }
  }, [exercise, open])

  // ❌ si no hay ejercicio
  if (!exercise) return null

  return (
    <Dialog
      open={open}
      onClose={() => {
        setMedia([])
        onClose()
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogContent
        sx={{
          background: "#0f172a",
          p: 0,
          position: "relative"
        }}
      >

        {/*BOTÓN CERRAR */}
        <IconButton
          onClick={() => {
            setMedia([])
            onClose()
          }}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#fff",
            zIndex: 10
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* 🖼️ SIN ARCHIVOS */}
        {media.length === 0 ? (
          <Box
            sx={{
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8"
            }}
          >
            <Typography>No hay archivos disponibles</Typography>
          </Box>
        ) : (

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            style={{ height: "500px" }}
          >

            {media.map((item: any, i: number) => {

              //detectar si es video
              const isVideo = /\.(mp4|webm|ogg)$/i.test(item.file_path)

              //URL correcta usando helper
              const url = getImageUrl(item.file_path, "exercises")

              console.log("URL FINAL:", url)

              return (
                <SwiperSlide key={i}>
                  <Box
                    sx={{
                      height: "500px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "black"
                    }}
                  >

                    {isVideo ? (
                      <video
                        src={url}
                        controls
                        style={{ width: "100%", maxHeight: "100%" }}
                      />
                    ) : (
                      <img
  src={url}
  alt="media"
  style={{
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain",
    borderRadius: "10px"
  }}
/>
                    )}

                  </Box>
                </SwiperSlide>
              )
            })}

          </Swiper>
        )}

      </DialogContent>
    </Dialog>
  )
}