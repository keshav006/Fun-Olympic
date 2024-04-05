import React from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Tab = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs?.find((tab) => tab.current)?.name}
          onChange={(e) => onTabClick(parseInt(e.target.value))}
        >
          {tabs?.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
          {tabs?.map((tab) => (
            <a
              key={tab.id}
              href={tab.href}
              className={classNames(
                tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10',
                tab.id === tabs[0].id ? 'rounded-l-lg' : '',
                tab.id === tabs[tabs.length - 1].id ? 'rounded-r-lg' : ''
              )}
              aria-current={tab.current ? 'page' : undefined}
              onClick={(e) => onTabClick(e, tab.id)}
            >
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  tab.current ? 'bg-indigo-500' : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-0.5'
                )}
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tab;
