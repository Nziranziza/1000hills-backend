export const authEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="color: #1A237E; padding: 30px; background-color: #F5F5F5; font-family: 'Montserrat', sans-serif; font-size: 16px; line-height: 1.5; min-height: 500px; display: flex">
    <div style="background-color: #FFF; max-width: 352px; margin: auto; box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1); border-radius: 10px; box-sizing: border-box;">
        <div style="padding: 10px; text-align: center">
            <img style="width: 100px; height: 100px" src='https://raw.githubusercontent.com/Nziranziza/1000hills/main/assets/images/adaptive-icon.png' />
        </div>
        <div style="background-color: #FF6B6B; color: #FFF; text-align: center; padding: 5px 0px;">
            <h1 style="font-size: 20px;">{title}</h1>
        </div>
        <div style="padding: 30px; text-align: center">
          {body}
        </div>
        <div style="padding: 0px 30px 30px 30px;">
            <a style="padding: 18px 0px; background-color: #009688; display: inline-block; width: 100%; text-align: center; text-decoration: none; color: #FFF; font-weight: 600; border-radius: 10px" href="{link}">{buttonTitle}</a>
        </div>
    </div>
</body>
</html>`;
