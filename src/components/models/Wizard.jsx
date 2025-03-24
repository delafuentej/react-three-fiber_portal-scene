
import {  useGLTF } from '@react-three/drei';
import * as THREE from 'three';


export default function WizardModel() {


    const wizardModel = useGLTF('./model/wizard.glb',)
   
     // Asegurar que los materiales sean reactivos a la luz
     wizardModel.scene.traverse((child) => {
        if (child.isMesh) {
            if (!(child.material instanceof THREE.MeshStandardMaterial)) {
                child.material = new THREE.MeshStandardMaterial({ color: child.material.color });
            }
            child.material.needsUpdate = true;
        }
    });

    return <>
             <primitive object={wizardModel.scene} scale={0.01} position={[0, 0.28, -1.65]} rotation-y={0.7}/>
            </>

}