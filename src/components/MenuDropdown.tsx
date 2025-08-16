
import React, { useRef, useLayoutEffect, useState } from 'react';

interface MenuDropdownProps {
  anchorRef: HTMLButtonElement | null;
  children: React.ReactNode;
  onClose: () => void;
}

const MenuDropdown = ({ anchorRef, children, onClose }: MenuDropdownProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        (!anchorRef || !anchorRef.contains(e.target as Node))
      ) {
        onClose();
      }
    }
    function handleScroll() {
      onClose();
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [anchorRef, onClose]);

  // Position dropdown below anchor
  useLayoutEffect(() => {
    if (anchorRef && menuRef.current) {
      const rect = anchorRef.getBoundingClientRect();
      setStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
        transform: "translateX(-50%)",
        zIndex: 9999,
        minWidth: rect.width,
        maxHeight: "60vh",
        overflowY: "auto",
        background: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        border: "1px solid #e5e7eb",
      });
    }
  }, [anchorRef]);

  return (
    <div ref={menuRef} style={style}>
      {children}
    </div>
  );
};

export default MenuDropdown;
