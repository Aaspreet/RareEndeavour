import { useContext } from "react";

export default updateScrollingDown = (e, scrollingDown, setScrollingDown, previousScrollOffset) => {
  const currentOffset = e.nativeEvent.contentOffset.y;
  const contentSize = e.nativeEvent.contentSize.height;
  const visibleLength = e.nativeEvent.layoutMeasurement.height;

  const direction = currentOffset > previousScrollOffset ? "down" : "up";

  const isAtTop = currentOffset <= 20;
  const isAtBottom = contentSize - visibleLength - currentOffset <= 20;

  if (isAtTop || isAtBottom) {
    setScrollingDown(false);
    return currentOffset;
  }

  if (Math.abs(currentOffset - previousScrollOffset) < 10) return previousScrollOffset;

  if (direction === "down" && !scrollingDown) {
    setScrollingDown(true);
  } else if (direction === "up" && scrollingDown) {
    setScrollingDown(false);
  }

  return currentOffset;
};
