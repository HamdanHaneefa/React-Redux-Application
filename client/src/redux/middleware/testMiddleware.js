

function testMiddleware(store){
    return (next) =>{
        return (action) =>{
            console.log("PREV STATE :",store.getState())
            console.log(action)
            next(action)
            console.log("NEXT STATE :" ,store.getState())
            console.log('-----------------------')
        }
    }
}



export default testMiddleware