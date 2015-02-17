curl -X POST   
-H "X-Parse-Application-Id: ${APPLICATION_ID}"   
-H "X-Parse-REST-API-Key: ${REST_API_KEY}"   
-H "Content-Type: application/json"   
-d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}'   
https://api.parse.com/1/classes/chatterbox

curl -X GET \
>   -H "X-Parse-Application-Id: ${APPLICATION_ID}" \
>   -H "X-Parse-REST-API-Key: ${REST_API_KEY}" \
>   https://api.parse.com/1/classes/chatterbox/d0QUM1hamo


