<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>New Review</title>
</head>

<body style="margin:0;padding:0;background:#F2F2F2;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style=" background:#FFF; border-radius:20px; overflow:hidden; border:2px solid #E5E5E5; ">
                    <!-- HEADER -->
                    <tr>
                        <td align="center" style=" background:#0A0F23; padding:20px; ">
                            <img src="https://res.cloudinary.com/dhzmsgmq2/image/upload/v1780535699/logo_llqhcy.png"
                                alt="StreetEats" style=" max-width:220px; width:100%; height:auto; ">
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style=" background:#0A0F23; padding:25px; ">
                            <img src="https://res.cloudinary.com/dhzmsgmq2/image/upload/v1780535699/logo_llqhcy.png"
                                style="width:220px;">
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px;">
                            <h1 style=" color:#09080D; text-align:center; font-size:30px; margin-bottom:30px; ">
                                🎉 Your business received a new review!
                            </h1>

                            <p style=" font-size:17px; line-height:28px; color:#262730; ">
                                <strong>{{ $reviewerName }}</strong>
                                left a review for
                                <strong>{{ $businessName }}</strong>
                            </p>

                            <div style=" background:#F7F7F7; padding:25px; border-radius:18px; margin:30px 0; ">
                                <p style=" margin:0; font-size:18px; ">
                                    <strong>Rating:</strong>
                                    {{ $rating }}/5 ⭐
                                </p>

                                <p style=" margin-top:20px; font-size:16px; line-height:28px; color:#262730; ">
                                    {{ $comment }}
                                </p>
                            </div>

                            <p style=" font-size:15px; color:#5D98C0; ">
                                Keep providing amazing food experiences!
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style=" background:#F7F7F7; padding:30px; text-align:center; ">
                            StreetEats © {{ date('Y') }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>