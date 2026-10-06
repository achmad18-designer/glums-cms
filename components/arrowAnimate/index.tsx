import { motion } from "framer-motion";
import IcArrowRight from "../../assets/img/icon/arrow-right-white.png"
import IcArrowRight2 from "../../assets/img/icon/arrow-right-black.png"
interface Props {
    isHovered: boolean,
    width: number,
    height?: number,
    gap?: number,
    black?: boolean,
}
const ArrowAnimate = ({ isHovered, width, height, gap, black }: Props) => { 

    return (
        <motion.span className='arrowWrap__animate' initial={{ rotate: 0 }} animate={{ rotate: isHovered && black ? -30 : 0 }}>
            <motion.div className="arrows-icon" initial={{ x: -width }} style={{ gap: gap }} animate={{ x: isHovered ? width : -width }}>
                <img className='arrow__item' src={black ? IcArrowRight2 : IcArrowRight} alt="Go To" width={width} height={height ?? 24} />
                <img className='arrow__item' src={black ? IcArrowRight2 : IcArrowRight} alt="Go To" width={width} height={height ?? 24} />
            </motion.div>
        </motion.span>
    )
}

export default ArrowAnimate