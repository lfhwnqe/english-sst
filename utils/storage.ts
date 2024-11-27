// utils/storage.ts
// export const storage = {
//     saveScenes: (scenes: Scene[]) => {
//       if(typeof window !== 'undefined') {
//         localStorage.setItem('scenes', JSON.stringify(scenes))
//       }
//     },
    
//     getScenes: (): Scene[] => {
//       if(typeof window !== 'undefined') {
//         return JSON.parse(localStorage.getItem('scenes') || '[]')
//       }
//       return []
//     }
//   }