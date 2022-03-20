/**
 * @param {number} duration in milliseconds 
 */
const getDurationString: (duration: number) => string = (duration) => {
  return new Date(duration).toISOString().slice(11, 16)
}

export default getDurationString