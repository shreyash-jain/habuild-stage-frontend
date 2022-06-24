//DEV - Comment before pushing to delpoy
// export const API_BASE_URL = "http://localhost:4000";

//PROD - Uncomment before pushing to delpoy
export const API_BASE_URL = 'https://api.habuild./in'


export const Programs = {
    getPrograms: ()=> `${API_BASE_URL}/api/program/`,

}

export const Batches = {
    getBatchFromProgram: (programId)=>``
}