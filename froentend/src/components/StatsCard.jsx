export default function StatsCard({ title, value, icon: Icon, color }) {
    const getColorClasses = (color) => {
        const colors = {
            blue: 'from-blue-600 to-blue-700 text-blue-100',
            purple: 'from-purple-600 to-purple-700 text-purple-100',
            yellow: 'from-yellow-600 to-yellow-700 text-yellow-100',
            green: 'from-green-600 to-green-700 text-green-100',
            red: 'from-red-600 to-red-700 text-red-100',
            indigo: 'from-indigo-600 to-indigo-700 text-indigo-100'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${getColorClasses(color)}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
