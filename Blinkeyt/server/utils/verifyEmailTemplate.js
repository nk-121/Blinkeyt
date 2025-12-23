// Example verifyEmailTemplate

const verifyEmailTemplate = ({name,url})=>{
   
    return `<div style="max-width:700px; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%;">
    <h2 style="text-align:center; text-transform:uppercase;color:teal;">Welcome to the Blinkeyt.</h2>
    <p>Hi ${name}, Please click the below link to verify your email</p>
    <a href=${url} style="background:blue; text-decoration:none; color:#fff; padding:10px 20px; margin:10px 0; display:inline-block;">${url}</a>
    <p>Regards...</p>
    <p>Blinkeyt</p>
    </div>`;
};

export default verifyEmailTemplate;
