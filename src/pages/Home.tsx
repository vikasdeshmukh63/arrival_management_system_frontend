import Logo from '@/components/mycomponents/Logo'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="flex justify-between items-center w-full h-screen relative">
            <Logo />
            {/* left side */}
            <div className="w-full md:w-1/2 h-full md:flex justify-center items-center bg-gradient-to-b from-black to-orange-600 hidden">
                <img
                    src="./illustration.png"
                    alt=""
                />
            </div>

            {/* right side */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-start gap-4 p-4 md:p-20 relative">
                <img
                    src="./map.svg"
                    alt=""
                    className="absolute top-0 left-0 w-full h-full"
                />
                <h1 className="text-5xl font-bold z-10">
                    Welcome to the <br />
                    <span className="text-orange-500">Arrival Management System</span>
                </h1>
                <p className="text-muted-foreground z-10">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, cumque? Assumenda dicta delectus iusto repudiandae cum, accusantium
                    voluptate, odio, voluptatem inventore aut eaque fugit eveniet.
                </p>
                <div className="flex justify-between items-center gap-4 z-10">
                    <Link to="/login">
                        <Button>Get Started</Button>
                    </Link>
                    <Link to="/login">
                        <Button
                            variant="outline"
                            className="bg-orange-500 text-white">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
