export function isNumeric(value: string) {
  return /^\d+$/.test(value);
}
export function isValidConceptId(value: string): boolean {
  return isNumeric(value) && value.length > 3 && value.length < 11;
}

//Keep it for future
// export function formSearchQueryParam(search:string):string{
//     let queryParam = "";
//     const temp = search.split(/[ ]+/);
//     if(temp.length === 1){
//         queryParam= !isNumeric(temp[0]) ? "term="+temp[0]: "ecl=^"+temp[0];
//     }else{
//         if(!isNumeric(temp[0]) && !isNumeric(temp[1])){
//             return "term="+search;
//         }
//         if(isNumeric(temp[0])){
//             queryParam="ecl=^"+temp[0];
//         }else{
//             queryParam="term="+temp[0];
//         }
//     if(isNumeric(temp[1])){
//         queryParam="&ecl=^"+temp[1];
//     }else{
//         queryParam="&term="+temp[1];
//         }
//
//     }
//     return queryParam;
// }
