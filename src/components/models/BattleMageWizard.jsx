
import {  useGLTF } from '@react-three/drei';
import * as THREE from 'three';


export default function BattleMageWizardModel() {


    const battleMageWizardModel = useGLTF('./model/battlemage_wizard.glb');

    
   
     //Asegurar que los materiales sean reactivos a la luz
     battleMageWizardModel.scene.traverse((child) => {
        if (child.isMesh) {
            if (!(child.material instanceof THREE.MeshStandardMaterial)) {
                child.material = new THREE.MeshStandardMaterial({ color: child.material.color });
            }
            child.material.needsUpdate = true;
        }
    });
    
    return <>
                    
                     <primitive 
                        object={battleMageWizardModel.scene} 
                        scale={0.6} 
                        position={[0, 0.88, -1.69]} 
                        rotation-y={Math.PI *2}
                        castShadow
                        receiveShadow
                        />
                
                   {/* position={[0, 0.28, -1.65]} */}
            </>

}