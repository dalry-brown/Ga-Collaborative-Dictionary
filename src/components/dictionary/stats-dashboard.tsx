'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DictionaryStats } from '@/lib/types/dictionary';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsDashboardProps {
  stats: DictionaryStats;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  color = 'blue' 
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-gray-900">
                {value.toLocaleString()}
              </p>
              {trend && (
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-gray-500'
                )}>
                  <TrendingUp className={cn(
                    "h-3 w-3 mr-1",
                    trend === 'down' && "rotate-180"
                  )} />
                  {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center border",
            colorClasses[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsDashboard({ stats, className }: StatsDashboardProps) {
  const completionRate = stats.totalWords > 0 
    ? Math.round((stats.verifiedWords / stats.totalWords) * 100)
    : 0;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4", className)}>
      <StatCard
        title="Total Words"
        value={stats.totalWords}
        icon={BookOpen}
        description="Ga words in dictionary"
        color="blue"
        trend="up"
      />
      
      <StatCard
        title="Verified Words"
        value={stats.verifiedWords}
        icon={CheckCircle}
        description={`${completionRate}% completion rate`}
        color="green"
      />
      
      <StatCard
        title="Incomplete Entries"
        value={stats.incompleteEntries}
        icon={AlertCircle}
        description="Need community help"
        color="yellow"
      />
      
      <StatCard
        title="Pending Review"
        value={stats.pendingReview}
        icon={Clock}
        description="Awaiting approval"
        color="purple"
      />
      
      <StatCard
        title="Contributors"
        value={stats.activeContributors}
        icon={Users}
        description="Active this month"
        color="blue"
      />
    </div>
  );
}

// Compact version for smaller screens
export function CompactStats({ stats }: { stats: DictionaryStats }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">
          {stats.totalWords.toLocaleString()}
        </div>
        <div className="text-xs text-gray-600">Total Words</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {stats.verifiedWords.toLocaleString()}
        </div>
        <div className="text-xs text-gray-600">Verified</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-600">
          {stats.incompleteEntries.toLocaleString()}
        </div>
        <div className="text-xs text-gray-600">Incomplete</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">
          {stats.activeContributors.toLocaleString()}
        </div>
        <div className="text-xs text-gray-600">Contributors</div>
      </div>
    </div>
  );
}