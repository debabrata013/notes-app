export default function StatsCard({ title, value, icon: Icon, color }) {
    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            purple: 'bg-purple-50 text-purple-600 border-purple-100',
            yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
            green: 'bg-green-50 text-green-600 border-green-100',
            red: 'bg-red-50 text-red-600 border-red-100',
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
