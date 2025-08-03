"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Sphere, Box, Stars } from "@react-three/drei"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Camera,
  School,
  Users,
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Sparkles,
  BookOpen,
  Globe,
  AlertTriangle,
  Microscope,
  Calculator,
  Palette,
  Music,
} from "lucide-react"
import type * as THREE from "three"

// Extend Window interface to include jsQR
declare global {
  interface Window {
    jsQR: ((data: Uint8ClampedArray, width: number, height: number, opts?: any) => any) | undefined
  }
}

interface StudentData {
  id: string
  name: string
  phone: string
  email: string
}

interface ScanStatus {
  isScanning: boolean
  hasData: boolean
  isSubmitting: boolean
  message: string
  type: "success" | "error" | "info"
}

// Enhanced 3D School Scene
function EuroSchoolScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Modern School Building */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.2}>
        <group>
          {/* Main Building - Professional Blue */}
          <Box args={[4, 3, 2]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#1e40af" />
          </Box>
          {/* Roof */}
          <Box args={[4.5, 0.3, 2.5]} position={[0, 3.15, 0]}>
            <meshStandardMaterial color="#374151" />
          </Box>
          {/* Windows - Clean White */}
          {[-1.2, 0, 1.2].map((x, i) => (
            <Box key={i} args={[0.6, 0.8, 0.1]} position={[x, 2, 1.05]}>
              <meshStandardMaterial color="#f8fafc" emissive="#dbeafe" emissiveIntensity={0.1} />
            </Box>
          ))}
          {/* Door */}
          <Box args={[0.8, 1.5, 0.1]} position={[0, 0.75, 1.05]}>
            <meshStandardMaterial color="#1f2937" />
          </Box>
          {/* School Sign */}
          <Box args={[2.5, 0.4, 0.1]} position={[0, 4, 1.05]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
        </group>
      </Float>

      {/* Floating Academic Elements */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Box args={[0.3, 0.4, 0.05]} position={[-3, 2, -1]} rotation={[0.1, 0.2, 0.05]}>
          <meshStandardMaterial color="#3b82f6" />
        </Box>
      </Float>

      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
        <Sphere args={[0.15]} position={[3, 1.8, -0.5]}>
          <meshStandardMaterial color="#60a5fa" />
        </Sphere>
      </Float>

      <Float speed={1.8} rotationIntensity={0.12} floatIntensity={0.4}>
        <Box args={[0.25, 0.35, 0.05]} position={[2.5, 3.2, 1]} rotation={[0.15, 0.05, -0.05]}>
          <meshStandardMaterial color="#1d4ed8" />
        </Box>
      </Float>
    </group>
  )
}

// Subtle Floating Elements
function SubtleParticles() {
  const particlesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={0.5 + Math.random() * 0.5} rotationIntensity={0.05} floatIntensity={0.3}>
          <Sphere
            args={[0.02 + Math.random() * 0.03]}
            position={[(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 12]}
          >
            <meshStandardMaterial
              color={["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"][Math.floor(Math.random() * 4)]}
              emissive={["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"][Math.floor(Math.random() * 4)]}
              emissiveIntensity={0.1}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

export default function EuroSchoolScanner() {
  const [studentData, setStudentData] = useState<StudentData>({
    id: "",
    name: "",
    phone: "",
    email: "",
  })

  const [scanStatus, setScanStatus] = useState<ScanStatus>({
    isScanning: false,
    hasData: false,
    isSubmitting: false,
    message: "",
    type: "info",
  })

  const [showPopup, setShowPopup] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showFailurePopup, setShowFailurePopup] = useState(false)
  const [apiErrorMessage, setApiErrorMessage] = useState("")
  const [scanError, setScanError] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanningRef = useRef<boolean>(false)
  const jsQRReady = useRef(false)

  // Load jsQR library dynamically
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"
    script.async = true
    script.onload = () => {
      jsQRReady.current = true
      console.log("jsQR script loaded.")
      // If scanning was attempted before jsQR loaded, restart scan loop
      if (scanningRef.current && videoRef.current?.srcObject) {
        scanForQRCode()
      }
    }
    script.onerror = () => {
      console.error("Failed to load jsQR script.")
      setScanStatus((prev) => ({
        ...prev,
        isScanning: false,
        message: "Failed to load QR scanner library. Please refresh.",
        type: "error",
      }))
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
      stopScanning() // Ensure camera is stopped on component unmount
    }
  }, [])

  // Parse QR code data
  const parseQRData = (qrString: string): StudentData | null => {
    try {
      const parts = qrString.split(",").map((part) => part.trim())
      if (parts.length >= 4) {
        return {
          id: parts[0],
          name: parts[1],
          phone: parts[2],
          email: parts[3],
        }
      }
      return null
    } catch (error) {
      console.error("Error parsing QR data:", error)
      return null
    }
  }

  // Real QR code scanning function using jsQR
  const scanForQRCode = () => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current || !jsQRReady.current || !window.jsQR) {
      if (scanningRef.current) {
        // Only request frame if still trying to scan
        requestAnimationFrame(scanForQRCode)
      }
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert", // Optimize for common QR codes
      })

      if (code) {
        console.log("QR Code detected:", code.data)
        const parsed = parseQRData(code.data)
        if (parsed) {
          setStudentData(parsed)
          setScanStatus((prev) => ({
            ...prev,
            hasData: true,
            isScanning: false,
            message: "QR code scanned successfully!",
            type: "success",
          }))
          stopScanning()
          setShowPopup(true)
          setScanError("")
          // Vibrate on successful scan (mobile only)
          if ("vibrate" in navigator) {
            navigator.vibrate(200)
          }
          return
        } else {
          setScanError("Invalid QR code format. Expected format: ID,Name,Phone,Email")
        }
      }
    }

    if (scanningRef.current) {
      requestAnimationFrame(scanForQRCode)
    }
  }

  // Start camera scanning
  const startScanning = async () => {
    try {
      setScanStatus((prev) => ({ ...prev, isScanning: true, message: "Starting camera...", type: "info" }))
      setScanError("")
      setShowSuccessPopup(false)
      setShowFailurePopup(false)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        scanningRef.current = true

        videoRef.current.onloadedmetadata = () => {
          setScanStatus((prev) => ({ ...prev, message: "Point camera at QR code", type: "info" }))
          scanForQRCode() // Start scanning loop once video metadata is loaded
        }

        // Set a timeout to show error if no QR code is found after a delay
        setTimeout(() => {
          if (scanningRef.current && !scanStatus.hasData) {
            setScanError("No QR code detected yet. Make sure the QR code is clearly visible and well-lit.")
          }
        }, 15000) // Increased timeout for better user experience
      }
    } catch (error: any) {
      let errorMessage = "Failed to access camera. "
      if (error.name === "NotAllowedError") {
        errorMessage += "Please allow camera permissions and try again."
      } else if (error.name === "NotFoundError") {
        errorMessage += "No camera found on this device."
      } else if (error.name === "NotSupportedError") {
        errorMessage += "Camera not supported in this browser."
      } else {
        errorMessage += "Please check your camera and try again."
      }

      setScanStatus((prev) => ({
        ...prev,
        isScanning: false,
        message: errorMessage,
        type: "error",
      }))
      scanningRef.current = false
    }
  }

  // Stop scanning
  const stopScanning = () => {
    scanningRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setScanStatus((prev) => ({
      ...prev,
      isScanning: false,
    }))
    setScanError("")
  }

  // Submit to Zoho CRM via backend
  const submitData = async () => {
    setScanStatus((prev) => ({ ...prev, isSubmitting: true, message: "Submitting to Zoho CRM...", type: "info" }))
    setShowPopup(false) // Close the student details popup immediately

    try {
      const response = await fetch("/api/zoho-checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentData,
          timestamp: new Date().toISOString(),
          source: "euro-school-scanner",
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setScanStatus((prev) => ({
          ...prev,
          isSubmitting: false,
          message: "Student check-in successful!",
          type: "success",
        }))
        setShowSuccessPopup(true) // Show success popup
        // Automatically close success popup after 3 seconds
        setTimeout(() => setShowSuccessPopup(false), 3000)
        resetScanner() // Reset scanner after successful check-in
      } else {
        throw new Error(result.error || "Failed to submit data")
      }
    } catch (error: any) {
      setScanStatus((prev) => ({
        ...prev,
        isSubmitting: false,
        message: `Failed to submit: ${error.message}`,
        type: "error",
      }))
      setApiErrorMessage(error.message || "An unexpected error occurred.")
      setShowFailurePopup(true) // Show failure popup
      // Automatically close failure popup after 5 seconds
      setTimeout(() => setShowFailurePopup(false), 5000)
    }
  }

  // Reset scanner
  const resetScanner = () => {
    setStudentData({ id: "", name: "", phone: "", email: "" })
    setScanStatus({
      isScanning: false,
      hasData: false,
      isSubmitting: false,
      message: "",
      type: "info",
    })
    setShowPopup(false)
    setShowSuccessPopup(false)
    setShowFailurePopup(false)
    setScanError("")
    setApiErrorMessage("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 overflow-hidden relative">
      {/* Enhanced 3D Background - More Visible */}
      <div className="fixed inset-0 z-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.8} />
          <pointLight position={[8, 8, 8]} intensity={1.5} color="#3b82f6" />
          <pointLight position={[-8, -8, -8]} intensity={0.6} color="#60a5fa" />
          <Stars radius={100} depth={50} count={1200} factor={4} saturation={0} fade speed={0.8} />
          <EuroSchoolScene />
          <SubtleParticles />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
        </Canvas>
      </div>

      {/* Enhanced 2D Sticker Background - More Stickers */}
      <div className="fixed inset-0 z-5 pointer-events-none">
        {/* Academic Stickers */}
        <div className="absolute top-16 left-12 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <div className="absolute top-32 right-20 w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
          <Globe className="w-7 h-7 text-slate-600" />
        </div>
        <div className="absolute bottom-32 left-16 w-18 h-18 bg-blue-50 rounded-full flex items-center justify-center shadow-lg transform rotate-45">
          <Award className="w-9 h-9 text-blue-500" />
        </div>
        <div className="absolute bottom-48 right-14 w-15 h-15 bg-slate-200 rounded-lg flex items-center justify-center shadow-lg transform -rotate-12">
          <Trophy className="w-8 h-8 text-yellow-600" />
        </div>
        <div className="absolute top-1/2 left-8 w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center shadow-lg transform rotate-30">
          <School className="w-6 h-6 text-blue-700" />
        </div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center shadow-lg transform -rotate-15">
          <Users className="w-8 h-8 text-slate-500" />
        </div>

        {/* Additional Subject Stickers */}
        <div className="absolute top-24 left-1/3 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-md transform rotate-25">
          <Microscope className="w-6 h-6 text-green-600" />
        </div>
        <div className="absolute bottom-24 left-1/4 w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center shadow-md transform -rotate-20">
          <Calculator className="w-7 h-7 text-purple-600" />
        </div>
        <div className="absolute top-1/4 right-1/3 w-13 h-13 bg-pink-100 rounded-full flex items-center justify-center shadow-md transform rotate-40">
          <Palette className="w-6 h-6 text-pink-600" />
        </div>
        <div className="absolute bottom-20 right-1/4 w-15 h-15 bg-orange-100 rounded-lg flex items-center justify-center shadow-md transform -rotate-35">
          <Music className="w-7 h-7 text-orange-600" />
        </div>

        {/* Minimalistic Geometric Stickers */}
        <div className="absolute top-20 left-1/2 w-8 h-8 bg-blue-200 rounded-full shadow-md transform rotate-45"></div>
        <div className="absolute bottom-40 left-1/3 w-6 h-6 bg-slate-300 rounded-lg shadow-md transform -rotate-30"></div>
        <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-blue-100 rounded-full shadow-md transform rotate-60"></div>
        <div className="absolute bottom-28 right-1/3 w-12 h-12 bg-slate-200 rounded-lg shadow-md transform -rotate-45"></div>
        <div className="absolute top-2/3 left-1/5 w-7 h-7 bg-blue-300 rounded-full shadow-md transform rotate-15"></div>
        <div className="absolute top-1/5 right-1/5 w-9 h-9 bg-slate-100 rounded-lg shadow-md transform -rotate-25"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Enhanced Header with Better Visibility */}
        <div className="text-center pt-8 pb-6 px-4 bg-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <School className="h-12 w-12 md:h-16 md:w-16 text-blue-700 drop-shadow-lg" />
              <Sparkles className="h-5 w-5 text-blue-500 absolute -top-1 -right-1 animate-pulse drop-shadow-sm" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-slate-800 bg-clip-text text-transparent drop-shadow-sm">
              Euro School
            </h1>
            <div className="relative">
              <Globe className="h-12 w-12 md:h-16 md:w-16 text-slate-700 drop-shadow-lg" />
              <div className="h-3 w-3 bg-blue-600 rounded-full absolute -top-1 -right-1 animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-slate-700 font-semibold mb-4 drop-shadow-sm">
            Excellence in Education • Global Standards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge className="bg-blue-700 text-white px-4 py-2 text-lg shadow-lg">
              <Users className="h-4 w-4 mr-2" />
              2000+ Students
            </Badge>
            <Badge className="bg-slate-700 text-white px-4 py-2 text-lg shadow-lg">
              <Award className="h-4 w-4 mr-2" />
              International Curriculum
            </Badge>
          </div>
        </div>

        {/* Centered QR Scanner with Better Spacing */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <Card className="backdrop-blur-lg bg-white/95 border-2 border-blue-100 shadow-2xl rounded-2xl overflow-hidden max-w-md w-full transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-slate-700 p-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Camera className="h-6 w-6 text-white" />
                <Sparkles className="h-6 w-6 text-blue-200" />
              </div>
            </div>

            <CardContent className="p-6">
              {/* Compact Video Preview */}
              <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-blue-50 rounded-xl overflow-hidden shadow-inner mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${scanStatus.isScanning ? "block" : "hidden"}`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!scanStatus.isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Camera className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-slate-600 font-semibold text-lg">Ready to Scan</p>
                      <div className="flex justify-center gap-2 mt-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}

                {scanStatus.isScanning && (
                  <div className="absolute inset-0">
                    <div className="absolute inset-4 border-3 border-blue-500 rounded-xl animate-pulse">
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Scanning...
                      </div>
                      {/* Scanning Line */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {scanError && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 font-medium">{scanError}</AlertDescription>
                </Alert>
              )}

              {/* Status Message */}
              {scanStatus.message && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 font-semibold mb-4 ${
                    scanStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : scanStatus.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {scanStatus.type === "success" && <CheckCircle className="h-5 w-5" />}
                  {scanStatus.type === "error" && <XCircle className="h-5 w-5" />}
                  <span>{scanStatus.message}</span>
                </div>
              )}

              {/* Scanner Controls */}
              <div className="space-y-3">
                {!scanStatus.isScanning && !scanStatus.hasData && (
                  <Button
                    onClick={startScanning}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Start Scanning
                  </Button>
                )}

                {scanStatus.isScanning && (
                  <Button
                    onClick={stopScanning}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 transform hover:scale-105 transition-all duration-200"
                  >
                    Stop Scanning
                  </Button>
                )}

                {scanStatus.hasData && (
                  <Button
                    onClick={resetScanner}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 transform hover:scale-105 transition-all duration-200"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Scan Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Excellence Section with Proper Spacing */}
        <div className="px-4 pb-8 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="backdrop-blur-sm bg-white/90 border border-blue-100 text-center shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-700 text-lg mb-2">Academic Excellence</h3>
                <p className="text-sm text-slate-600">World-class curriculum</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/90 border border-blue-100 text-center shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="font-bold text-slate-700 text-lg mb-2">Global Standards</h3>
                <p className="text-sm text-slate-600">International recognition</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/90 border border-blue-100 text-center shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-700 text-lg mb-2">Expert Faculty</h3>
                <p className="text-sm text-slate-600">Qualified educators</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/90 border border-blue-100 text-center shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-bold text-slate-700 text-lg mb-2">Achievements</h3>
                <p className="text-sm text-slate-600">Award-winning school</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Student Details Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl shadow-2xl">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
                  ES
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
              Student Verified
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-600 font-semibold">
              Ready to check-in to Zoho CRM
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">ID</span>
                </div>
                ID
              </Label>
              <Input
                value={studentData.id}
                disabled
                className="bg-blue-50 border-2 border-blue-200 h-12 text-lg font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Full Name
              </Label>
              <Input value={studentData.name} disabled className="bg-slate-50 border-2 border-slate-200 h-12 text-lg" />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-xs text-green-600">📱</span>
                </div>
                Phone Number
              </Label>
              <Input
                value={studentData.phone}
                disabled
                className="bg-green-50 border-2 border-green-200 h-12 text-lg font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-xs text-purple-600">@</span>
                </div>
                Email Address
              </Label>
              <Input
                value={studentData.email}
                disabled
                className="bg-purple-50 border-2 border-purple-200 h-12 text-lg"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={submitData}
              disabled={scanStatus.isSubmitting}
              className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200"
            >
              {scanStatus.isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Checking In...
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5 mr-2" />
                  Check-In to CRM
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowPopup(false)}
              variant="outline"
              className="h-14 px-6 text-lg font-bold border-2 border-slate-300 hover:bg-slate-100"
            >
              ✕
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Confirmation Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="max-w-sm mx-auto bg-gradient-to-br from-white to-green-50 border-2 border-green-100 rounded-2xl shadow-2xl text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700">Success!</DialogTitle>
            <DialogDescription className="text-lg text-green-600 font-semibold">
              Student successfully checked in to Zoho CRM.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowSuccessPopup(false)}
            className="w-full mt-6 h-12 text-lg font-bold bg-green-600 hover:bg-green-700"
          >
            Great!
          </Button>
        </DialogContent>
      </Dialog>

      {/* Failure Confirmation Popup */}
      <Dialog open={showFailurePopup} onOpenChange={setShowFailurePopup}>
        <DialogContent className="max-w-sm mx-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-100 rounded-2xl shadow-2xl text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl animate-shake">
                <XCircle className="w-10 h-10" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-red-700">Failed!</DialogTitle>
            <DialogDescription className="text-lg text-red-600 font-semibold">
              Failed to check-in student. {apiErrorMessage}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowFailurePopup(false)}
            className="w-full mt-6 h-12 text-lg font-bold bg-red-600 hover:bg-red-700"
          >
            Try Again
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
