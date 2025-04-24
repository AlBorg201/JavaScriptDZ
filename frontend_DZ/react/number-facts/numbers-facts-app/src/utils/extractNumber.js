const extractNumber = fact => {
    const match = fact.match(/^\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };
  
  export default extractNumber;