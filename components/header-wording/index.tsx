import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import ArrowAnimate from "../../components/arrowAnimate";
import "./header-wording.scss";

interface Props {
    headline1: string,
    headline2: string,
    desc: string,
    width?: number,
    homeWp?: boolean,
    scrollTo: () => void
}
const HeaderWording = ({ headline1, headline2, desc, width, homeWp, scrollTo }: Props) => {

    // State untuk menyimpan ukuran window
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        // Fungsi untuk mengupdate ukuran window
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Menambahkan event listener untuk resize
        window.addEventListener('resize', handleResize);

        // Membersihkan event listener saat komponen unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const ref = useRef(null)
    const isInView = useInView(ref, {
        once: true
    })
    const [isHovered, setIsHovered] = useState(false)

    const toUp = {
        active: (custom: number) => ({ y: 0, transition: { duration: windowSize.width > 1080 ? 0.5 : 1, delay: custom * 0.2 } }),
        inActive: { y: windowSize.width > 1080 ? 100 : 300 },
    }
    const toDown = {
        active: (custom: number) => ({ y: 0, transition: { duration: windowSize.width > 1080 ? 0.5 : 1, delay: custom * 0.2 } }),
        inActive: { y: windowSize.width > 1080 ? -100 : -300 },
    }
    const other = {
        active: (custom: number) => ({ y: 0, opacity: 1, transition: { duration: 0.5, delay: custom * 0.2 } }),
        inActive: { y: 50, opacity: 0 },
    }

    return (
        <motion.section ref={ref} className={`section-text ${homeWp ? 'home-wp' : ''}`}>
            <div className="wording-wrapp" style={{ width: width ? `${width}%` : '' }}>
                <div className='welcome-text'>
                    <motion.div className='text-item' >
                        <motion.div className="text-pointer" initial="inActive" variants={toDown} animate="active" custom={1} >{headline1}</motion.div>
                    </motion.div>
                    <motion.button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => scrollTo()} initial="inActive" variants={other} animate="active" custom={4} className='text-action'>Explore Now <ArrowAnimate gap={25} width={26} height={24} isHovered={isHovered} /></motion.button>
                </div>
                <div className='welcome-text'>
                    <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0 }} transition={{ duration: 0.5, delay: 1.5 }} src={'/img/icon/two-start.png'} alt="Two Star" width={139} height={109} />
                    <div className='text-item' >
                        <motion.div className="text-pointer" initial="inActive" variants={toUp} animate="active" custom={2} >{headline2}</motion.div>
                    </div>
                    <motion.div initial="inActive" variants={other} animate="active" custom={5} className='text-secondLine'>{desc}</motion.div>
                </div>
            </div>
            <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0 }} transition={{ duration: 0.5, delay: 1.5 }} className='scrolldown-wrap'>
                <motion.img src={'/img/icon/arrow-black.png'} width={114} height={114} alt='scroll down' animate={{ rotate: [0, 360] }} transition={{
                    repeat: Infinity, duration: 4,
                    ease: "easeInOut",
                }} />
                <motion.img src={'/img/icon/two-start.png'} width={22} height={25} alt='arrow scroll down' />
            </motion.span>
        </motion.section>
    )
}

export default HeaderWording