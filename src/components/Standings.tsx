import { Trophy, Users } from 'lucide-react';
import type { DriverStanding, ConstructorStanding } from '../types/f1';

interface StandingsProps {
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
}

export function Standings({ drivers, constructors }: StandingsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold font-rationalist">Driver Standings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 w-12 font-rationalist">Pos</th>
                <th className="pb-3 font-rationalist">Driver</th>
                <th className="pb-3 font-rationalist">Team</th>
                <th className="pb-3 w-16 font-rationalist">Points</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {drivers.map((standing) => (
                <tr key={standing.driver.code} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-2 text-center">{standing.position}</td>
                  <td className="py-2 whitespace-nowrap text-center">
                    {standing.driver.firstName[0]}.{standing.driver.lastName}
                  </td>
                  <td className="py-2 text-gray-600 whitespace-nowrap text-center">
                    {standing.constructor.name}
                  </td>
                  <td className="py-2 font-medium text-center">
                    {standing.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold font-rationalist">Constructor Standings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 w-12 font-rationalist">Pos</th>
                <th className="pb-3 font-rationalist">Constructor</th>
                <th className="pb-3 w-16 font-rationalist">Points</th>
                <th className="pb-3 w-16 font-rationalist">Wins</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {constructors.map((standing) => (
                <tr key={standing.constructor.name} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-2 text-center">{standing.position}</td>
                  <td className="py-2 whitespace-nowrap text-center">
                    {standing.constructor.name}
                  </td>
                  <td className="py-2 font-medium text-center">
                    {standing.points}
                  </td>
                  <td className="py-2 text-center">
                    {standing.wins}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}