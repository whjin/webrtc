# WebRTC-Server

WebRTC Server视频对讲服务

- 生成私钥：`openssl genpkey -algorithm RSA -out key.pem`
- 使用生成的私钥生成自签名证书：`openssl req -new -key key.pem -x509 -out cert.pem`