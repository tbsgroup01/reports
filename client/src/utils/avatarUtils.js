// Professional avatar photo collection for operators
const AVATAR_MAP = {
  abdesh: "http://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
  rahul: "http://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
  baiju: "http://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
  kush: "http://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80",
  test: "http://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80",
  sdgdfgdfh: "http://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
};

export const getOperatorAvatar = (operator) => {
  if (!operator) {
    return "http://ui-avatars.com/api/?name=User&background=0e6b38&color=fff&rounded=true&bold=true";
  }
  if (operator.avatar) return operator.avatar;
  const username = (operator.username || "").toLowerCase().trim();

  if (AVATAR_MAP[username]) {
    return AVATAR_MAP[username];
  }

  // Consistent high-res photos based on ID
  const defaultPhotos = [
    "http://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    "http://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    "http://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    "http://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80",
    "http://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80",
    "http://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
    "http://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
  ];

  const idx = Math.abs((Number(operator.id) || 1) % defaultPhotos.length);
  return defaultPhotos[idx];
};

