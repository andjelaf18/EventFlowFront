import './TopPanel.css'

function TopPanel(){

    return (
        <>
        <div className='goreDesno'>
            <div className='ikonica' title="poruke"> 
                <i className="bi bi-chat-fill"></i>
                <span className="badge-dot"></span> {/* Crvena tačkica za nove notifikacije */}
            </div>

            <div className='ikonica' title="obavestenje">
                <i className="bi bi-bell-fill"></i>
            </div>
        </div>
        
        </>
    )

}
export default TopPanel