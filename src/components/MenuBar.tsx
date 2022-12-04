import { useScriptideContext } from '../contexts/ScriptideProvider';
import { FC } from 'react';
import SendToNotion from "../components/SendToNotion/SendToNotion"

const MenuBar: FC = () => {
  const {
    setExcalActive,
    excalActive,
    menuState,
    setMenuState,
    transitionState,
    setTransitionState,
    setOpacity,
  } = useScriptideContext();

  const toggleMenu = () => {
    setMenuState(!menuState);
  };

  const handleExcali = () => {
    setTransitionState(!transitionState);
    if (excalActive) {
      setExcalActive(false);
      setOpacity(true);
    } else {
      setTimeout(() => setExcalActive(!excalActive), 180);
      setTimeout(() => setOpacity(false), 180);
    }
  };

  return (
    <>
      <div id='menu' className={menuState ? 'menu-open' : 'menu-closed'}>
        <div className='menu-item' onClick={handleExcali}>
          <p>E</p>
        </div>
        <SendToNotion/>
      </div>
      <div
        className={menuState ? 'menu-btn-mod' : 'menu-btn'}
        onClick={toggleMenu}
      >
        {menuState ? '◄' : '►'}
      </div>
    </>
  );
};

export default MenuBar;
