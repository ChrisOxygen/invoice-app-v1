import ThemeSwitcherBtn from "../ui/ThemeSwitcherBtn";

function SiteMenu() {
  return (
    <div className="menu-bar">
      <div className="logo-wrapper">
        <img src="/assets/logo.svg" alt="" />
      </div>
      <ThemeSwitcherBtn />
      <div className="user-avater">
        <img src="/assets/image-avatar.jpg" alt="" />
      </div>
    </div>
  );
}

export default SiteMenu;
