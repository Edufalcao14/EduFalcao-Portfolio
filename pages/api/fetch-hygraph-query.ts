 export const fetchHygraphQuery = async <T> (
    query:String , 
    revalidate?:number
):Promise<T> =>{
    const response = await fetch(process.env.HYGRAPH_URL! , {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`
        },
        body:JSON.stringify({ query }),
        next:{
            //revalidate: 60 * 60 * 24 
            revalidate:revalidate// 24 hours
        }
    });

    const {data} = await response.json();
    return data;
 };