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
// ... [file content exactly as in code block above] ...
