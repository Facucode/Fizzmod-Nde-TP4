import fs from 'fs';

const setMail = async () => {
    try{
        await fs.promises.readFile('correo.data','utf-8');
    }
    catch(error){
        if(error.code === 'ENOENT'){
            try{
                await fs.promises.writeFile('correo.dat','nodefacumail@gmail.com')
                
            }
            catch(error){
                console.log(error)
            }
        }
        else console.log(error)
    }
}

export default setMail