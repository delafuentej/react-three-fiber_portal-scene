import { OrbitControls, useGLTF, useTexture, Center, Sparkles, shaderMaterial, Environment} from '@react-three/drei';
import { extend, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef} from 'react';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';
import WizardModel from './components/models/Wizard';
import BattleMageWizardModel from './components/models/BattleMageWizard';

/*
-The model "portal" is composed of multiple parts((portal.nodes)) :(not add the whole model at once to the scene )
    - portal.nodes.baked: the baked model => so we need to apply a MeshBasicMaterial with the baked texture
    - portal.nodes.poleLightA/B/portalLight: 3 pole lights Meshes => so we need too  apply a MeshBasicMaterial 
    - portal.nodes.Scene :The portal => we need to apply a ShaderMaterial
-We are going to add each element separately in order to have more control over them
- To load the texture we are going to use "useTexture" from drei
-FIREFLIES:  We are going to use a drei helper called "Sparkles"
- PORTAL-SCENE: We need to add a custom ShaderMaterial. There are 3 uniforms (uTime, uColorStart, uColorEnd). We need to send them
- drei provides a helper called "shaderMaterial" that make available in the .jsx files the ShaderMaterial. 
- this simplify the process of creating and updating uniforms
- To convert PortalMaterial(it a class that we can instantiate) into an react-three-fiber we are going to use "extend" from r3f
- ANIMATION: We need first a reference to the material
*/

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#ffffff'),
        uColorEnd: new THREE.Color('#000000')
    },
    portalVertexShader,
    portalFragmentShader
)

extend({PortalMaterial});

export default function Experience(){


    //fog
   const {scene} = useThree();
   scene.fog = new THREE.FogExp2("#61563f", 0.05);


    const {nodes} = useGLTF('./model/portal.glb');
    console.log('nodes', nodes)

    //baked texture:
    const bakedTexture = useTexture('./model/baked.jpg');
    console.log('bakedTexture',bakedTexture)
    // so the texture is immediately returned when calling useTexture, we can directly flip it:
    bakedTexture.flipY = false; //oder in meshBasicMaterial prop => map-flipY={false}
    bakedTexture.encoding = THREE.sRGBEncoding;

    //portal ref
    const portalMaterialRef= useRef();

    
    // portal animation
    useFrame((state, delta)=>{
        portalMaterialRef.current.uTime += delta * 3;

    });





    return <>

      <color attach="background" args={["#61563f"]} />

       <Environment
        background
        files='./environmentMap/vincent-mactiernan-asset.hdr'
        ground={{
            height: 20,//7
            radius: 28,//28
            scale: 50//100
        }} 
     
        />
    



         <ambientLight intensity={3} />

        <OrbitControls makeDefault />

        <Center  position={[0, 0, 0]}>

            {/* floor */}
            <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#61563f" transparent opacity={0}/>
            </mesh>

             {/* baked */}
            <mesh geometry={nodes.baked.geometry}>
                <meshBasicMaterial  map={bakedTexture}/>
            </mesh>

            {/* pole lights */}
            <mesh 
                geometry={nodes.poleLightA.geometry} 
                position={nodes.poleLightA.position}
            >
                 <meshBasicMaterial color='#ffffe5'/>
            </mesh>

            <mesh 
                geometry={nodes.poleLightB.geometry} 
                position={nodes.poleLightB.position}
            >
                 <meshBasicMaterial color='#ffffe5'/>
            </mesh>

            <mesh 
                geometry={nodes.portalLight.geometry}
                position={nodes.portalLight.position}
                rotation={nodes.portalLight.rotation}
            >
                   {/* portal Scene- Shader Material */}
                   <portalMaterial ref={portalMaterialRef}/>
                   {/* <shaderMaterial 
                        vertexShader={portalVertexShader}
                        fragmentShader={portalFragmentShader}
                        uniforms={{
                            uTime: new THREE.Uniform(0),
                            uColorStart: new THREE.Uniform(new THREE.Color('#ffffff')),
                            uColorEnd: new THREE.Uniform(new THREE.Color('#000000'))
                        }}
                        
                   /> */}

            </mesh>


            {/* Sparkles- Fireflies */}
            <Sparkles
                count={500} 
                size={3}
                scale={[10, 5, 10]}
                position={[0,0,0]}
                speed={0.4}
                
            />
            

            <WizardModel />
              
            <BattleMageWizardModel />     
           
       
        </Center>

      
       
       
    </>
};

useGLTF.preload('./model/portal.glb');