<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Verify your email</title>
</head>

<body style=" margin:0; padding:0; background:#F0F0F0; font-family:Arial, Helvetica, sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style=" background:#FFFFFF; border-radius:20px; border:2px solid #E0E0E0; overflow:hidden; ">
                    <!-- HEADER -->
                    <tr>
                        <td align="center" style=" background:#0A0F23; padding:20px; ">
                            <img src="https://res.cloudinary.com/dhzmsgmq2/image/upload/v1780535699/logo_llqhcy.png"
                                alt="StreetEats" style=" max-width:220px; width:100%; height:auto; ">
                        </td>
                    </tr>

                    <!-- CONTENT -->
                    <tr>
                        <td style=" padding:40px; color:#262730; ">
                            <h1 style=" color:#09080D; font-size:28px; text-align:center; ">
                                Reset your password
                            </h1>

                            <p style=" font-size:16px; line-height:26px; margin-bottom:20px; text-align:center; ">
                                Use the verification code below to reset your password. 
                            </p>

                            <div
                                style=" background:#F7F7F7; border-radius:16px; padding:25px; text-align:center; margin-bottom:30px; ">
                                <span style=" font-size:42px; font-weight:bold; letter-spacing:8px; color:#F25A10; ">
                                    {{ $code }}
                                </span>
                            </div>

                            <p style=" font-size:15px; color:#5D98C0; ">
                                This code expires in 10 minutes.
                            </p>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style=" padding:30px; background:#F7F7F7; text-align:center; ">
                            <p style=" margin:0; font-size:14px; color:#262730; line-height:24px; ">
                                If you did not request this email, you can safely ignore it.
                            </p>

                            <p style=" margin-top:10px; font-size:14px; color:#262730; ">
                                Need help? Contact us at
                                <strong>
                                    support@example.com
                                </strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>