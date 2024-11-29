

export const getTimeInSeconds = (time: string): number => {
  const [mm, ss] = time.split(':');

  if (!ss) {
    return Number(mm);
  } else {
    const minsInSec = 60 * (Number(mm) ?? 0)
    const timeInSeconds = Number(ss) + minsInSec;

    return timeInSeconds;
  }
}

export const formatTime = (val?: string): string => {
  const tis = getTimeInSeconds(val ?? '');
  if (tis > 0) {
    const seconds = tis % 60;
    const mins = Math.floor(tis / 60)
    return `${mins}:${seconds < 10 ? 0 : ''}${seconds}`;
  }
  return '';
};