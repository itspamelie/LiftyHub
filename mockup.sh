#!/bin/bash
# Uso: ./mockup.sh screenshot.png resultado.png

INPUT="${1:-screenshot.png}"
OUTPUT="${2:-mockup.png}"

if [ ! -f "$INPUT" ]; then
  echo "Archivo no encontrado: $INPUT"
  exit 1
fi

# Dimensiones del screenshot
SW=$(magick identify -format "%w" "$INPUT")
SH=$(magick identify -format "%h" "$INPUT")

# Padding del cuerpo del iPhone alrededor de la pantalla
PX=52       # padding horizontal
PT=110      # padding top (zona Dynamic Island)
PB=110      # padding bottom (zona home indicator)
CORNER=60   # radio de esquinas del iPhone
SCREEN_R=12 # radio de esquinas de la pantalla

FW=$((SW + PX * 2))
FH=$((SH + PT + PB))

# Ancho del borde lateral
BORDER=3

# Dynamic Island: píldora centrada en la parte superior
DI_W=110
DI_H=34
DI_X=$(( (FW - DI_W) / 2 ))
DI_Y=42

# Botones laterales (decorativos)
BTN_X=$((FW - BORDER - 8))
BTN_Y1=$((PT + 60))
BTN_Y2=$((PT + 180))
BTN_Y3=$((PT + 250))

LEFT_BTN_Y1=$((PT + 90))
LEFT_BTN_Y2=$((PT + 170))
LEFT_BTN_Y3=$((PT + 230))

# 1. Cuerpo del iPhone (negro con gradiente sutil)
magick -size ${FW}x${FH} xc:none \
  \( -size ${FW}x${FH} xc:"#1a1a1a" \
     -fill "#111111" \
     -draw "roundRectangle 0,0 $((FW-1)),$((FH-1)) ${CORNER},${CORNER}" \
  \) \
  -compose Over -composite \
  /tmp/lh_body.png

# 2. Cuerpo con borde brillante
magick /tmp/lh_body.png \
  -fill none \
  -stroke "#3a3a3a" -strokewidth ${BORDER} \
  -draw "roundRectangle 1,1 $((FW-2)),$((FH-2)) ${CORNER},${CORNER}" \
  /tmp/lh_frame.png

# 3. Recortar el screenshot con esquinas redondeadas
magick "$INPUT" \
  \( +clone -alpha extract \
     -draw "fill black polygon 0,0 0,${SCREEN_R} ${SCREEN_R},0" \
     \( +clone -flip \) -compose Multiply -composite \
     \( +clone -flop \) -compose Multiply -composite \
  \) \
  -alpha off -compose CopyOpacity -composite \
  /tmp/lh_screen.png

# 4. Pegar screenshot sobre el cuerpo
magick /tmp/lh_frame.png \
  /tmp/lh_screen.png \
  -geometry +${PX}+${PT} \
  -compose Over -composite \
  /tmp/lh_with_screen.png

# 5. Dynamic Island (píldora negra)
magick /tmp/lh_with_screen.png \
  -fill "#000000" \
  -draw "roundRectangle ${DI_X},${DI_Y} $((DI_X + DI_W)),$((DI_Y + DI_H)) 17,17" \
  /tmp/lh_di.png

# 6. Botón de encendido (derecha)
magick /tmp/lh_di.png \
  -fill "#2a2a2a" -stroke "#3a3a3a" -strokewidth 1 \
  -draw "roundRectangle $((FW-5)),$((PT+60)) $((FW+3)),$((PT+180)) 3,3" \
  /tmp/lh_btn1.png

# 7. Botones de volumen (izquierda)
magick /tmp/lh_btn1.png \
  -fill "#2a2a2a" -stroke "#3a3a3a" -strokewidth 1 \
  -draw "roundRectangle -3,$((PT+90)) 5,$((PT+160)) 3,3" \
  -draw "roundRectangle -3,$((PT+180)) 5,$((PT+240)) 3,3" \
  /tmp/lh_btns.png

# 8. Línea home indicator
HI_W=120
HI_X=$(( (FW - HI_W) / 2 ))
HI_Y=$((FH - 36))

magick /tmp/lh_btns.png \
  -fill "#555555" \
  -draw "roundRectangle ${HI_X},$((HI_Y)) $((HI_X + HI_W)),$((HI_Y + 5)) 3,3" \
  "$OUTPUT"

# Limpiar temporales
rm -f /tmp/lh_body.png /tmp/lh_frame.png /tmp/lh_screen.png /tmp/lh_with_screen.png /tmp/lh_di.png /tmp/lh_btn1.png /tmp/lh_btns.png

echo "Listo: $OUTPUT"
