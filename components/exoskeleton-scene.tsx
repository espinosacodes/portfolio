"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

const metal = { color: "#8d9690", metalness: .88, roughness: .24 }
const darkMetal = { color: "#2b302c", metalness: .9, roughness: .2 }

const visorVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const visorFragment = `
  uniform float uTime;
  uniform float uLocked;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying vec3 vNormal;
  float field(vec2 p) {
    return sin(p.x * 19.0 + uTime * 1.4) * sin(p.y * 15.0 - uTime) * .035
      + sin((p.x + p.y) * 31.0 - uTime * 1.8) * .018;
  }
  void main() {
    vec2 ratio = vec2(1.0, 1.22);
    float distanceToPointer = distance(vUv * ratio, uPointer * ratio) + field(vUv);
    float radius = .17 + sin(uTime * 1.8) * .012;
    float reveal = 1.0 - smoothstep(radius, radius + .12, distanceToPointer);
    reveal = mix(reveal, 1.0, uLocked);
    float edge = 1.0 - smoothstep(.0, .045, abs(distanceToPointer - radius));
    edge *= 1.0 - uLocked;
    float fresnel = pow(1.0 - abs(vNormal.z), 2.2);
    vec3 smoke = mix(vec3(.07, .08, .075), vec3(.58, .63, .60), fresnel);
    vec3 color = mix(smoke, vec3(1.0, .025, .18), edge * .86);
    float alpha = reveal * (.12 + fresnel * .27) + edge * .48;
    if (alpha < .015) discard;
    gl_FragColor = vec4(color, alpha);
  }
`

function HelmetRig({ locked }: { locked: boolean }) {
  const rig = useRef<THREE.Group>(null)
  const rotor = useRef<THREE.Group>(null)
  const visor = useRef<THREE.ShaderMaterial>(null)
  const pointerTarget = useRef({ x: 0, y: 0 })
  const visorUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uLocked: { value: 0 },
    uPointer: { value: new THREE.Vector2(.5, .5) },
  }), [])
  const nodes = useMemo(() => Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2
    return { angle, x: Math.cos(angle) * 2.17, y: Math.sin(angle) * 2.17 }
  }), [])

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointerTarget.current.x = event.clientX / innerWidth * 2 - 1
      pointerTarget.current.y = -(event.clientY / innerHeight * 2 - 1)
    }
    window.addEventListener("pointermove", move, { passive: true })
    return () => window.removeEventListener("pointermove", move)
  }, [])

  useFrame(({ clock }, delta) => {
    if (!rig.current) return
    const pointer = pointerTarget.current
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, pointer.x * .34, 4, delta)
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, pointer.y * .18, 4, delta)
    rig.current.rotation.z = THREE.MathUtils.damp(rig.current.rotation.z, pointer.x * -.055, 3, delta)
    rig.current.position.y = .2 + Math.sin(clock.elapsedTime * .8) * .035
    if (rotor.current) rotor.current.rotation.z = clock.elapsedTime * .08
    if (visor.current) {
      visor.current.uniforms.uTime.value = clock.elapsedTime
      visor.current.uniforms.uPointer.value.lerp(new THREE.Vector2(pointer.x * .5 + .5, pointer.y * .5 + .5), .12)
      visor.current.uniforms.uLocked.value = THREE.MathUtils.damp(visor.current.uniforms.uLocked.value, locked ? 1 : 0, 5, delta)
    }
  })

  return <group ref={rig} position={[0, .62, 0]} scale={.68}>
    <group ref={rotor}>
      <mesh rotation={[0, 0, -.74]}><torusGeometry args={[2.08, .038, 14, 160, Math.PI * 1.48]} /><meshStandardMaterial {...metal} /></mesh>
      <mesh rotation={[0, 0, .42]} position={[0, 0, -.08]}><torusGeometry args={[1.84, .025, 10, 80, Math.PI * .48]} /><meshStandardMaterial color="#ff1a4d" emissive="#ff1a4d" emissiveIntensity={2.2} toneMapped={false} /></mesh>
      <mesh rotation={[0, 0, Math.PI + .42]} position={[0, 0, -.08]}><torusGeometry args={[1.84, .025, 10, 80, Math.PI * .34]} /><meshStandardMaterial color="#ff1a4d" emissive="#ff1a4d" emissiveIntensity={2.2} toneMapped={false} /></mesh>
      {nodes.map(({ angle, x, y }, index) => <mesh key={index} position={[x, y, -.02]} rotation={[0, 0, angle]}>
        <boxGeometry args={[index % 3 === 0 ? .18 : .08, .035, .09]} />
        <meshStandardMaterial color={index % 3 === 0 ? "#ff1a4d" : "#70756d"} emissive={index % 3 === 0 ? "#ff1a4d" : "#000000"} emissiveIntensity={2} />
      </mesh>)}
    </group>

    <mesh position={[0, .12, .18]} scale={[1.02, 1.15, .43]}>
      <sphereGeometry args={[1.62, 72, 48]} />
      <shaderMaterial ref={visor} uniforms={visorUniforms} vertexShader={visorVertex} fragmentShader={visorFragment} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>

    {[-1, 1].map(side => <group key={side} position={[side * 1.78, .02, .06]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.22, .28, .14, 24]} /><meshStandardMaterial {...metal} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, .14]}><torusGeometry args={[.24, .045, 10, 48]} /><meshStandardMaterial color="#ff1a4d" emissive="#ff1a4d" emissiveIntensity={2.6} toneMapped={false} /></mesh>
      <mesh position={[side * .2, -.65, -.02]} rotation={[0, 0, side * -.27]}><boxGeometry args={[.12, 1.18, .16]} /><meshStandardMaterial {...metal} /></mesh>
      <mesh position={[side * .46, -1.22, .01]} rotation={[0, 0, side * -.82]}><boxGeometry args={[.12, .82, .18]} /><meshStandardMaterial {...darkMetal} /></mesh>
    </group>)}

    <mesh position={[0, -1.63, -.06]} rotation={[0, 0, Math.PI]}><torusGeometry args={[2.38, .055, 14, 120, Math.PI]} /><meshStandardMaterial {...darkMetal} /></mesh>
    {[-1, 1].map(side => <group key={`shoulder-${side}`} position={[side * 2.22, -1.57, -.03]} rotation={[0, 0, side * -.3]}>
      <mesh><boxGeometry args={[.82, .18, .25]} /><meshStandardMaterial {...metal} /></mesh>
      <mesh position={[side * .36, -.28, 0]} rotation={[0, 0, side * .72]}><boxGeometry args={[.1, .72, .14]} /><meshStandardMaterial color="#ff1a4d" emissive="#ff1a4d" emissiveIntensity={1.8} toneMapped={false} /></mesh>
    </group>)}
  </group>
}

export default function ExoskeletonScene({ locked = false }: { locked?: boolean }) {
  return <Canvas camera={{ position: [0, 0, 7.4], fov: 36 }} dpr={[1, 1.7]} gl={{ alpha: true, antialias: true }}>
    <ambientLight intensity={1.6} />
    <directionalLight position={[3, 5, 6]} intensity={3.2} color="#ffffff" />
    <pointLight position={[-3, 1, 4]} intensity={16} distance={8} color="#ff1a4d" />
    <pointLight position={[3, -2, 3]} intensity={8} distance={7} color="#ffffff" />
    <HelmetRig locked={locked} />
  </Canvas>
}
