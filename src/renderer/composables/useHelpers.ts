export const lerp = (start: number, end: number, amt: number) => (1-amt)*start+amt*end

export const sleep = async (seconds: number) =>  {
    return new Promise((resolve) =>setTimeout(resolve, seconds * 1000));
}